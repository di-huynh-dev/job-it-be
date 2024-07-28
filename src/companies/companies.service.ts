import { Injectable } from '@nestjs/common'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose'
import { Company, CompanyDocument } from './schemas/company.schema'
import { InjectModel } from '@nestjs/mongoose'
import { IUser } from 'src/users/user.interface'
import { User } from 'src/auth/decorator/customize'

@Injectable()
export class CompaniesService {
  constructor(@InjectModel(Company.name) private companyModel: SoftDeleteModel<CompanyDocument>) {}
  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    return await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    })
  }

  findAll() {
    return `This action returns all companies`
  }

  findOne(id: number) {
    return `This action returns a #${id} company`
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    const updatedCompany = await this.companyModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    )
    return updatedCompany
  }

  async remove(id: string, user: IUser) {
    await this.companyModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    )
    return this.companyModel.softDelete({
      _id: id,
    })
  }
}
