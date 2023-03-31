import { Card, Form, Alert, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { authenticateUser } from "@/lib/authenticate";
import { useRouter } from "next/router";

import { useAtom } from "jotai";
import { favouritesAtom, searchHistoryAtom } from "@/store";
import { getFavourites, getHistory } from "@/lib/userData";

export default function Login(props) {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [warning, setWarning] = useState("");
    const router = useRouter();

    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
    const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await authenticateUser(user, password);
            console.log("before updateAtoms");
            await updateAtoms();
            console.log("after updateAtoms");
            router.push("/favourites");
        } catch (err) {
            setWarning(err.message);
        }
    }
    async function updateAtoms() {
        console.log("before getFavourites");
        setFavouritesList(await getFavourites());
        console.log("before getHistory");
        setSearchHistory(await getHistory());
        console.log("after getHistory");
    }

    return (
        <>
            <Card bg="light">
                <Card.Body>
                    <h2>Login</h2>Enter your login information below:
                </Card.Body>
            </Card>
            <br />
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>User:</Form.Label>
                    <Form.Control
                        type="text"
                        value={user}
                        id="userName"
                        name="userName"
                        onChange={(e) => setUser(e.target.value)}
                    />
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        id="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <br />
                {warning && (
                    <>
                        <br />
                        <Alert variant="danger">{warning}</Alert>
                    </>
                )}
                <Button variant="primary" className="pull-right" type="submit">
                    Login
                </Button>
            </Form>
        </>
    );
}
