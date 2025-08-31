import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getUserRoles } from "../utils/auth";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const checkRoles = async () => {
      const { globalRoles } = await getUserRoles();
      const hasAccess = allowedRoles.some(role => globalRoles.includes(role));
      setAllowed(hasAccess);
    };
    checkRoles();
  }, [allowedRoles]);

  if (allowed === null) {
    return <div className="p-6">⏳</div>;
  }

  if (!allowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
