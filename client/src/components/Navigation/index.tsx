import React, {useContext} from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar, NavbarBrand, NavbarText, Button } from "reactstrap";
import UserContext from "../../contexts/user";
export interface INavigationProps {}

const Navigation: React.FC<INavigationProps> = props => {
  const userContext = useContext(UserContext);
  const {user} = userContext.userState;

  const logout = () => {
    userContext.userDispatch({ type: "logout", payload: userContext.userState });
  }

  return (
    <Navbar color="light" light sticky="top" expand="md">
      <Container>
        <NavbarBrand tag={Link} to="/">π</NavbarBrand>
        <Nav className="mr-auto" navbar />
        {user._id !== "" ? 
          <div>
            <Button outline size="sm" tag={Link} to="/edit">
              κΈμ°κΈ°
            </Button>
            <NavbarText className="ml-2 mr-2">|</NavbarText>
            <Button outline size="sm" onClick={() => logout()}>
              λ‘κ·Έμμ
            </Button>
          </div>
        :
          <div>
            <NavbarText tag={Link} to="/login">Login</NavbarText>
            <NavbarText className="ml-2 mr-2">|</NavbarText>
            <NavbarText tag={Link} to="/register">νμκ°μ</NavbarText>
          </div>  
        }
      </Container>
    </Navbar>
  );
}

export default Navigation;