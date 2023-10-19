// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PangeaIPGeolocate } from '@/lib/ipLookups';
import { withAPIAuthentication } from '@/lib/pangeaMiddleware';
import type { NextApiRequest, NextApiResponse } from 'next'
import { PangeaConfig, IPIntelService, PangeaErrors } from "pangea-node-sdk";
import requestIp from 'request-ip';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const detectedIP = requestIp.getClientIp(req);

    if(!req.body.proxy) {
        const ipResponse = await PangeaIPGeolocate(detectedIP as string);
        return res.status(200).json(ipResponse as any)
    }


    res.status(200).json({"message": detectedIP})
}

export default withAPIAuthentication(handler)
