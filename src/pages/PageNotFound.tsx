import React from "react";
import { Link } from "react-router-dom";

const PageNotFound: React.FC = () => {
    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for doesn't exist.</p>
            <Link to="/">Go back to Main Page</Link>
        </div>
    );
};

export default PageNotFound;
