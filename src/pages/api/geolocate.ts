// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { withAPIAuthentication } from '@/lib/pangeaMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next'
import { PangeaConfig, IPIntelService, PangeaErrors } from "pangea-node-sdk";
import requestIp from 'request-ip';

function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const detectedIP = requestIp.getClientIp(req);

    res.status(200).json({"message": detectedIP})
}

export default withAPIAuthentication(handler)
