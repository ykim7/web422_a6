import { favouritesAtom } from "@/store.js";
import { Row, Col, Card } from "react-bootstrap";
import ArtworkCard from "@/components/ArtworkCard.js";
import { useAtom } from "jotai";

export default function Favourites() {
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    if (!favouritesList) {
        return null;
    } else {
        return (
            <Row>
                {favouritesList.length > 0 ? (
                    favouritesList.map((objId) => (
                        <Col key={objId}>
                            <ArtworkCard objectID={objId} />
                        </Col>
                    ))
                ) : (
                    <Card>
                        <Card.Body>
                            <h4>Nothing Here</h4> Try adding some new artwork to
                            the list.
                        </Card.Body>
                    </Card>
                )}
            </Row>
        );
    }
}
