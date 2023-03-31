/*********************************************************************************
 *  WEB422 – Assignment 4
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: Yujin Kim   Student ID: 117826214   Date: Mar 5, 2023
 *
 ********************************************************************************/

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Row, Col, Pagination } from "react-bootstrap";
import ArtworkCard from "../../components/ArtworkCard";
import Error from "next/error";
import { Card } from "react-bootstrap";
import validObjectIDList from "../../public/data/validObjectIDList.json";

const PER_PAGE = 12;
export default function ArtWork() {
    const [artworkList, setArtworkList] = useState();
    const [page, setPage] = useState(1);

    const router = useRouter();
    let finalQuery = router.asPath.split("?")[1];

    const { data, error } = useSWR(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`
    );

    function previousPage() {
        if (page > 1) {
            setPage(page - 1);
        }
    }
    function nextPage() {
        if (page < artworkList.length) {
            setPage(page + 1);
        }
    }
    useEffect(() => {
        if (data) {
            const result = [];
            let filteredResults = validObjectIDList.objectIDs.filter((x) =>
                data.objectIDs?.includes(x)
            );
            for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
                const chunk = filteredResults.slice(i, i + PER_PAGE);
                result.push(chunk);
            }
            setArtworkList(result);
        }
        setPage(1);
    }, [data]);

    if (error) {
        return <Error statusCode={404} />;
    }
    if (!artworkList) {
        return null;
    }

    return (
        <>
            {artworkList.length > 0 ? (
                <>
                    <Row className="gy-4">
                        {artworkList[page - 1].map((currentObjectID) => (
                            <Col lg={3} key={currentObjectID}>
                                <ArtworkCard objectID={currentObjectID} />
                            </Col>
                        ))}
                    </Row>
                    <br />
                    <Row>
                        <Pagination>
                            &nbsp; &nbsp; &nbsp;
                            <Pagination.Prev onClick={previousPage} />
                            <Pagination.Item>{page}</Pagination.Item>
                            <Pagination.Next onClick={nextPage} />
                        </Pagination>
                    </Row>
                </>
            ) : (
                <Card>
                    <Card.Body>
                        <h4>Nothing Here</h4>
                        Try searching for something else
                    </Card.Body>
                </Card>
            )}
        </>
    );
}
