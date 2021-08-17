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
        <NavbarBrand tag={Link} to="/">📝</NavbarBrand>
        <Nav className="mr-auto" navbar />
        {user._id !== "" ? 
          <div>
            <Button outline size="sm" tag={Link} to="/edit">
              글쓰기
            </Button>
            <NavbarText className="ml-2 mr-2">|</NavbarText>
            <Button outline size="sm" onClick={() => logout()}>
              로그아웃
            </Button>
          </div>
        :
          <div>
            <NavbarText tag={Link} to="/login">Login</NavbarText>
            <NavbarText className="ml-2 mr-2">|</NavbarText>
            <NavbarText tag={Link} to="/register">회원가입</NavbarText>
          </div>  
        }
      </Container>
    </Navbar>
  );
}

export default Navigation;