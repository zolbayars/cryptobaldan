import { NextApiRequest, NextApiResponse } from "next";
import { getTrades } from "@/helpers/trades";
import { DateTime } from "luxon";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const { email, password } = req.body;

  try {
    // @todo get this from front-end
    const trades = await getTrades(
      DateTime.now().minus({ weeks: 1 }),
      DateTime.now().minus({ weeks: 0 })
    );

    res.status(200).json(trades);
  } catch (error) {
    console.error("Error while getting latest trades", error);

    res
      .status(500)
      .send(
        `Could not fetch the latest trades. Reason: ${(error as Error).message}`
      );
  }
}
