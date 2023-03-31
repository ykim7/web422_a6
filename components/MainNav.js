import { useRouter } from "next/router";
import { useState } from "react";
import { Container, Nav, Navbar, Form, Button } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import Link from "next/link";
import { useAtom } from "jotai";
import { searchHistoryAtom } from "../store.js";
import { addToHistory } from "@/lib/userData.js";
import { readToken, removeToken } from "@/lib/authenticate.js";

export default function MainNav() {
    const router = useRouter();
    const [searchField, setSearchField] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

    function handleQuery(e) {
        setSearchField(e.target.value);
    }
    async function formsubmit(e) {
        e.preventDefault();
        setIsExpanded(false);
        const queryString = `title=true&q=${searchField}`;
        setSearchHistory(await addToHistory(`title=true&q=${searchField}`));
        router.push(`/artwork?title=true&q=${searchField}`);
    }
    function clickedToggle() {
        setIsExpanded(!isExpanded);
    }
    function clickedLink(e) {
        setIsExpanded(false);
    }
    let token = readToken();

    function logout() {
        setIsExpanded(false);
        removeToken();
        router.push("/login");
    }
    return (
        <>
            <Navbar
                className="fixed-top navbar-dark bg-primary"
                expanded={isExpanded}
            >
                <Container>
                    <Navbar.Brand className="navbar-brand">
                        YujinKim
                    </Navbar.Brand>
                    <Navbar.Toggle onClick={clickedToggle} />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link href="/" legacyBehavior passHref>
                                <Nav.Link
                                    onClick={clickedLink}
                                    active={router.pathname === "/"}
                                >
                                    Home
                                </Nav.Link>
                            </Link>
                            {token && (
                                <Link href="/search" legacyBehavior passHref>
                                    <Nav.Link
                                        onClick={clickedLink}
                                        active={router.pathname === "/search"}
                                    >
                                        Advanced Search
                                    </Nav.Link>
                                </Link>
                            )}
                        </Nav>
                        &nbsp;
                        {token && (
                            <Form className="d-flex" onSubmit={formsubmit}>
                                <Form.Control
                                    type="text"
                                    placeholder="Search"
                                    className="me-2"
                                    aria-label="Search"
                                    value={searchField}
                                    onChange={handleQuery}
                                />
                                <Button variant="success" type="submit">
                                    Search
                                </Button>
                            </Form>
                        )}
                        &nbsp;
                        <Nav>
                            {token ? (
                                <NavDropdown
                                    title={token.userName}
                                    id="basic-nav-dropdown"
                                >
                                    <Link
                                        href="/favourites"
                                        legacyBehavior
                                        passHref
                                    >
                                        <NavDropdown.Item onClick={clickedLink}>
                                            Favourites
                                        </NavDropdown.Item>
                                    </Link>
                                    <Link
                                        href="/history"
                                        legacyBehavior
                                        passHref
                                    >
                                        <NavDropdown.Item onClick={clickedLink}>
                                            Search History
                                        </NavDropdown.Item>
                                    </Link>
                                    <NavDropdown.Item onClick={logout}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            ) : (
                                <Nav className="me-auto">
                                    <Nav.Link
                                        href="/register"
                                        legacyBehavior
                                        passHref
                                        onClick={clickedLink}
                                        active={router.pathname === "/register"}
                                    >
                                        Register
                                    </Nav.Link>
                                    <Nav.Link
                                        href="/login"
                                        legacyBehavior
                                        passHref
                                        onClick={clickedLink}
                                        active={router.pathname === "/login"}
                                    >
                                        Login
                                    </Nav.Link>
                                </Nav>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <br />
            <br />
            <br />
        </>
    );
}
