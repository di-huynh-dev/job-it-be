import { Injectable, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose'
import { Permission, PermissionDocument } from 'src/permissions/schemas/permission.schema'
import { Role, RoleDocument } from 'src/roles/schemas/role.schema'
import { User, UserDocument } from 'src/users/schemas/user.schema'
import { UsersService } from 'src/users/users.service'
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample'

@Injectable()
export class DatabasesService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
    @InjectModel(Permission.name) private permissionModel: SoftDeleteModel<PermissionDocument>,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}
  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT')
    if (Boolean(isInit)) {
      const countUser = await this.userModel.count({})
      const countPermission = await this.permissionModel.count({})
      const countRole = await this.roleModel.count({})

      //create permissions
      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS)
      }

      //Create role
      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select('_id')
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Full access permission',
            isActive: true,
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: 'Only using user permission',
            isActive: true,
            permissions: [],
          },
        ])
      }

      //create user
      if (countUser === 0) {
        const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE })
        const userRole = await this.roleModel.findOne({ name: USER_ROLE })

        await this.userModel.insertMany([
          {
            name: 'ADMIN',
            email: 'admin@gmail.com',
            password: this.userService.hashPassword(this.configService.get<string>('INIT_PASSWORD')),
            age: 20,
            gender: 'MALE',
            address: 'HCM',
            role: adminRole._id,
          },
          {
            name: 'USER',
            email: 'user@gmail.com',
            password: this.userService.hashPassword(this.configService.get<string>('INIT_PASSWORD')),
            age: 20,
            gender: 'MALE',
            address: 'HCM',
            role: userRole._id,
          },
        ])
      }
      if (countUser > 0 && countPermission > 0 && countRole > 0) {
        console.log('Already create sample database!')
      }
    }
  }
}
