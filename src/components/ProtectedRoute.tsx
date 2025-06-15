
import React from "react";

/**
 * With authentication disabled, just render children.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
export default ProtectedRoute;
