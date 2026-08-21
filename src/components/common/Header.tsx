import React from "react";
import { useComponentStyle } from "../../hooks/useComponentStyle";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { logout } from "../../redux/authSlice";
import { ThemeToggle } from "./ThemeToggle";

export const Header: React.FC = () => {
  const Styles = useComponentStyle("header");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const handleSignIn = (e : React.MouseEvent) => {
    e.preventDefault();
    navigate("/signIn");
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header style={Styles.wrapper}>
      <div style={Styles.logo}>
        <img src="/images/logo.png" alt="Nostalgia AI" style={Styles.image}/>
      </div>
      <div style={Styles.right}>
        {isAuthenticated ? (
          <div style={Styles.userSection}>
            <span style={Styles.userName}>{user?.firstName || 'User'}</span>
            <div className="icon-btn" style={Styles.profileCircle} onClick={() => navigate('/profile')}></div>
            <button className="btn btn-secondary" style={Styles.signOut} onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <button className="btn btn-outline" style={Styles.signIn} onClick={handleSignIn}>Sign In</button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
};