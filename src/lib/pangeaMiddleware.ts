import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const getBearerToken = (req: NextApiRequest) => {
  const authorizationHeader =
    req.headers instanceof Headers
      ? req.headers.get("authorization")
      : req.headers?.authorization;

  const authorizationHeaderParts = authorizationHeader?.split(" ");

  const bearerToken =
    authorizationHeaderParts?.[0]?.toLowerCase() === "bearer" &&
    authorizationHeaderParts?.[1];

  return bearerToken;
};

const validateToken = async (token: string) => {
  const result = false;

  if (token) {
    const SERVICEURL = `https://authn.${process.env.PANGEA_DOMAIN}/v1/client/token/check`;
    console.log(SERVICEURL)
    try {
      const response = await fetch(SERVICEURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AUTHN_SERVICE_TOKEN || ""}`,
        },
        body: JSON.stringify({ token: token }),
      });

      const responseJSON = await response.json();

      return responseJSON.status === "Success";
    } catch (error) {
      console.error(
        "Error occured during token validation. Looks like environment variables haven't been set correctly, or the service token has expired",
        error
      );
    }
  }
  return result;
};

export const withAPIAuthentication = (apiHandler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Check the environment variables
    if (
      !process.env.PANGEA_DOMAIN ||
      !process.env.AUTHN_SERVICE_TOKEN
    ) {
        console.log(process.env.AUTHN_SERVICE_TOKEN)
      console.error(
        "Missing environment variables, please make sure you have NEXT_PUBLIC_PANGEA_DOMAIN and AUTHN_SERVICE_TOKEN set in your .env file"
      );
      return res.status(401).json({"error": "Unauthorized"});
    }

    const isTokenValid = await validateToken(getBearerToken(req) as string);
    console.log(getBearerToken(req))
    // Authentication failed, return 401
    if (!isTokenValid) {
        return res.status(401).json({"error": "Unauthorized"});
    }

    // We are good to continue
    return await apiHandler(req, res);
  };
};