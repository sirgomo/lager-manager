import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegiUserDTO } from 'src/DTO/regiUserDTO';
import { UserEntity } from 'src/entity/userEntity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}
  async getAllUsers(): Promise<UserEntity[]> {
    try {
      return await this.userRepo.find({
        select: {
          id: true,
          nachname: true,
          role: true,
          username: true,
          vorname: true,
        },
      });
    } catch (err) {
      throw new Error('Etwas is schiff gelaufen user repo ' + err);
    }
  }
  async getUser(userid: number): Promise<UserEntity> {
    try {
      return await this.userRepo.findOneBy({ id: userid });
    } catch (err) {
      throw new Error(
        'Etwas is schiff gegangen als ich wollte user nach id finden ' + err,
      );
    }
  }
  async addUser(user: RegiUserDTO): Promise<RegiUserDTO> {
    try {
      const hashed: string = await bcrypt.hash(user.userpassword, 12);
      const salt: string = await bcrypt.getSalt(hashed);

      const newUser: UserEntity = new UserEntity();
      if (user.id !== -1) {
        newUser.id = user.id;
      }

      newUser.nachname = user.nachname;
      newUser.vorname = user.vorname;
      newUser.role = user.role;
      newUser.username = user.username;

      newUser.userpassword = hashed;
      newUser.salt = salt;
      console.log(newUser);
      return await this.userRepo.save(newUser).then((data) => {
        /* if(data.nachname === user.nachname){
               let tmp:RegiUserDTO = new RegiUserDTO();
               tmp.nachname = data.nachname;
               tmp.role = data.role;
               tmp.password = data.userpassword;
               tmp.username = data.username;
               tmp.vorname = data.vorname;
                return tmp;
            }*/
        if (data.nachname === user.nachname) {
          data.userpassword = '';
          return data;
        }
      });
    } catch (err) {
      throw new Error('Etwas ist schiff gegangen bei user registration ' + err);
    }
  }
  async editUser(user: RegiUserDTO): Promise<UserEntity> {
    try {
      await this.userRepo.create(user);
      return await this.userRepo.save(user);
    } catch (err) {
      throw new Error(
        'Etwas ist schiff gelaufen als ich wollte den user ändern ' + err,
      );
    }
  }
  async deleteUser(userId: number) {
    try {
      return (await this.userRepo.delete({ id: userId })).affected;
    } catch (err) {
      throw new Error(
        'Etwas ist schiff gelaufen als ich wolle den user löschen ' + err,
      );
    }
  }
}
