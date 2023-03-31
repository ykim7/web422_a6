import useSWR from "swr";
import Error from "next/error";
import Card from "react-bootstrap/Card";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import { favouritesAtom } from "../store.js";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

import { addToFavourites, removeFromFavourites } from "@/lib/userData.js";

export default function ArtworkCardDetail({ objectID }) {
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
    const [showAdded, setShowAdded] = useState(false);

    useEffect(() => {
        setShowAdded(favouritesList?.includes(objectID));
    }, [favouritesList]);

    async function favouritesClicked() {
        if (showAdded) {
            setFavouritesList(await removeFromFavourites(objectID));
            setShowAdded(false);
        } else {
            setFavouritesList(await addToFavourites(objectID));
            setShowAdded(true);
        }
    }
    const { data, error } = useSWR(
        objectID
            ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
            : null
    );
    if (error) {
        return <Error statusCode={404} />;
    }
    if (!data) {
        return null;
    } else {
        const imgURL = data.primaryImage ? data.primaryImage : null;
        return (
            <>
                <Card>
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
                            <br />
                            <br />
                            <div>
                                <strong>Artist: </strong>
                                {data.artistDisplayName
                                    ? data.artistDisplayName
                                    : "N/A"}
                                (&nbsp;
                                {data.artistDisplayName && (
                                    <a
                                        href={data.artistWikidata_URL}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        wiki
                                    </a>
                                )}
                                &nbsp;)
                            </div>
                            <div>
                                <strong>Credit Line: </strong>
                                {data.creditLine ? data.creditLine : "N/A"}
                            </div>
                            <div>
                                <strong>Demensions: </strong>
                                {data.dimensions ? data.dimensions : "N/A"}
                            </div>
                            <div>
                                <Button
                                    variant={
                                        showAdded
                                            ? "primary"
                                            : "outline-primary"
                                    }
                                    onClick={favouritesClicked}
                                >
                                    {showAdded
                                        ? "+ Favourite (added)"
                                        : "+ Favourite"}
                                </Button>
                            </div>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </>
        );
    }
}
