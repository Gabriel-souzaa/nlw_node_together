import { getCustomRepository } from "typeorm";
import { ComplimentRepositories } from "../repositories/ComplimentRepositories";
import { UserRepositories } from "../repositories/UserRepositories";
import { ErrorHandler } from "../utils/errors";

interface IComplimentRequest {
   tag_id: string,
   user_sender: string,
   user_receiver: string,
   message: string
}

class CreateComplimentServices {
   async execute({ tag_id, user_sender, user_receiver, message }: IComplimentRequest) {
      const complimentsRepositories = getCustomRepository(ComplimentRepositories);
      const usersRepositories = getCustomRepository(UserRepositories);

      if (user_sender === user_receiver) {
         throw new ErrorHandler(404, "Incorrect User Receiver");
      }

      const userReceiverExists = await usersRepositories.findOne(user_receiver);

      if (!userReceiverExists) {
         throw new ErrorHandler(404, "User Receiver does not exists");
      }

      const compliment = complimentsRepositories.create({
         tag_id,
         user_sender,
         user_receiver,
         message
      })

      await complimentsRepositories.save(compliment);

      return compliment;

   }
}

export { CreateComplimentServices };

