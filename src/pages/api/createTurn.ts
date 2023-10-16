import { generarStringAleatorio } from '@/lib/generateTurnString';
import connectDB from '@/models/mongoConnection';
import Department from '@/models/mongoSchemas/departmentSchema';
import Turn from '@/models/mongoSchemas/turnScheme';
import type { NextApiRequest, NextApiResponse } from 'next';

// - Para usar este endpoint, se debe hacer una petición POST con los siguientes datos:
// {
//   department_name: 'Nombre del departamento',
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await connectDB();

    const { department_name } = req.body;

    let turnString = '';

    let validated = false;

    while (!validated) {
      turnString = generarStringAleatorio();

      const validateTurn = await Turn.findOne({
        turn: turnString,
        $or: [{ status: 'pending' }, { status: 'attending' }],
      });

      if (!validateTurn) {
        validated = true;
      }
    }

    const department = await Department.findOne({ name: department_name });

    const newTurn = new Turn({
      turn: turnString,
      department: department._id,
    });

    await newTurn.save();

    res.status(200).json({ message: 'Turno creado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
}
