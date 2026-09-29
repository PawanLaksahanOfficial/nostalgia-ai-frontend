import React from "react";
import { useComponentStyle } from "../../hooks/useComponentStyle";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/store";
import { logout } from "../../redux/authSlice";
import { ThemeToggle } from "./ThemeToggle";
import { Avatar } from "./Avatar";

export const Header: React.FC = () => {
  const Styles = useComponentStyle("header");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { isMobile } = useSelector((state: RootState) => state.style);

  const navItems = [
    { to: "/", label: "Create", end: true },
    ...(isAuthenticated ? [{ to: "/videos", label: "My Videos", end: false }] : []),
    { to: "/pricing", label: "Pricing", end: false },
  ];

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
      <Link to="/" style={Styles.logo} aria-label="Nostalgia AI home">
        <img src="/images/logo.png" alt="Nostalgia AI" style={Styles.image}/>
      </Link>
      <nav style={Styles.nav} aria-label="Main">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div style={Styles.right}>
        {isAuthenticated ? (
          <>
            {!isMobile && user?.firstName && (
              <span style={Styles.userName}>Hi, {user.firstName}</span>
            )}
            <button
              type="button"
              className="avatar-btn"
              style={Styles.avatarButton}
              onClick={() => navigate("/profile")}
              aria-label="Open your profile"
              title="Your profile"
            >
              <Avatar src={user?.avatarUrl} size={isMobile ? 34 : 38} alt="" />
            </button>
            {/* On phones Sign Out lives on the Profile page to keep the header on one row. */}
            {!isMobile && (
              <button className="btn btn-secondary" style={Styles.signOut} onClick={handleSignOut}>Sign Out</button>
            )}
          </>
        ) : (
          <button className="btn btn-outline" style={Styles.signIn} onClick={handleSignIn}>Sign In</button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
};
