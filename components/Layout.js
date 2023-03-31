import Container from "react-bootstrap/Container";
import MainNav from "./MainNav";

export default function layout(props) {
    return (
        <>
            <MainNav />
            <br />
            <Container>{props.children}</Container>
            <br />
        </>
    );
}
