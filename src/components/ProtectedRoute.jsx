import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { getUserRoles } from "../utils/auth";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const [allowed, setAllowed] = useState(null);
  const { academyId } = useParams();

  useEffect(() => {
    const checkRoles = async () => {
      const { globalRoles, academies } = await getUserRoles();

      if (allowedRoles.some(role => globalRoles.includes(role))) {
        setAllowed(true);
        return;
      }

      if (academyId) {
        const academy = academies.find(
          a => String(a.academyId) === String(academyId)
        );
        if (academy && allowedRoles.some(role => academy.roles.includes(role))) {
          setAllowed(true);
          return;
        }
      }

      setAllowed(false);
    };

    checkRoles();
  }, [allowedRoles, academyId]);

  if (allowed === null) {
    return <div className="p-6">Loading...</div>;
  }

  if (!allowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
