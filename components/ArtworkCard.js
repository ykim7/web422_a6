import useSWR from "swr";
import Error from "next/error";
import Card from "react-bootstrap/Card";
import Link from "next/link";
import Button from "react-bootstrap/Button";

export default function ArtworkCard({ objectID }) {
    const { data, error } = useSWR(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
    );
    if (error) {
        return <Error statusCode={404} />;
    }
    if (!data) {
        return null;
    } else {
        const imgURL = data.primaryImageSmall
            ? data.primaryImageSmall
            : "https://via.placeholder.com/375x375.png?text=[+Not+Available+]";
        return (
            <>
                <Card style={{ width: "18rem" }}>
                    <Card.Img variant="top" src={imgURL} />
                    <Card.Body>
                        <Card.Title>
                            {data.title ? data.title : "N/A"}
                        </Card.Title>
                        <Card.Text>
                            <div>
                                <strong>Date: </strong>
                                {data.objectDate ? data.objectDate : "N/A"}
                            </div>
                            <div>
                                <strong>Classification: </strong>
                                {data.classification
                                    ? data.classification
                                    : "N/A"}
                            </div>
                            <div>
                                <strong>Medium: </strong>
                                {data.medium ? data.medium : "N/A"}
                            </div>
                        </Card.Text>
                        <Link href={`/artwork/${objectID}`} passHref>
                            <Button variant="outline-primary">
                                <strong>ID: </strong>
                                {objectID}
                            </Button>
                        </Link>
                    </Card.Body>
                </Card>
            </>
        );
    }
}
