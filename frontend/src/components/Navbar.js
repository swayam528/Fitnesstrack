import { Link, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import styled from "styled-components";

const NavContainer = styled.header`
  background: white;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const NavInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BrandName = styled.div`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  a {
    position: relative;
    text-decoration: none;
    color: #666;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;

    &.active {
      background-color: rgba(0, 200, 83, 0.1);
      color: #00c853;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: 2px solid #00c853;
  padding: 6px 16px;
  border-radius: 4px;
  color: #00c853;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #00c853;
    color: white;
  }
`;

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const location = useLocation();

  const handleClick = () => {
    logout();
  };

  return (
    <NavContainer>
      <NavInner>
        <LogoSection>
          <Link to="/">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#00C853"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </Link>
          <BrandName>FitTrack</BrandName>
        </LogoSection>
        <Nav>
          {user && (
            <NavLinks>
              <Link
                to="/diet"
                className={location.pathname === "/diet" ? "active" : ""}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                Diet Feed
              </Link>
              <Link
                to="/"
                className={location.pathname === "/" ? "active" : ""}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
                </svg>
                Workouts
              </Link>
              <Link
                to="/chat"
                className={location.pathname === "/chat" ? "active" : ""}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
                Chat with FitBot
              </Link>
              <LogoutButton onClick={handleClick}>Log out</LogoutButton>
            </NavLinks>
          )}
          {!user && (
            <NavLinks>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </NavLinks>
          )}
        </Nav>
      </NavInner>
    </NavContainer>
  );
};

export default Navbar;
