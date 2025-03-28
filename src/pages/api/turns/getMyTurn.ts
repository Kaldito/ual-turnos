import connectDB from '@/models/mongoConnection';
import Turn from '@/models/mongoSchemas/turnScheme';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición GET con los siguientes datos en el query:
// {
//   service_point_id: 'ID del punto de servicio',
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { service_point_id } = req.query;

    console.log(service_point_id);

    const myTurn = await Turn.findOne({
      servicePoint: service_point_id,
      status: 'attending',
    });

    console.log(myTurn);

    if (!myTurn) {
      return res.status(404).json({ message: 'No se te ha asignado un turno' });
    }

    console.log('pase esto');

    res.status(200).json({
      message: 'Turno obtenido',
      my_turn_data: myTurn,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
