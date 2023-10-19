// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withAPIAuthentication } from '@/lib/pangeaMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next'
import { PangeaConfig, IPIntelService, PangeaErrors } from "pangea-node-sdk";
import { getClientIp } from "request-ip";

function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const clientIP = req.connection.remoteAddress

    res.status(200).json({"message": clientIP})
}

export default withAPIAuthentication(handler)
