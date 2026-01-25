import {
	Body,
	Controller,
	Get,
	HttpCode,
	Put,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { UserDto } from './dto/user.dto.js'
import { UserService } from './user.service.js'

@Controller('user/profile')
export class UserController {
	constructor(private readonly userService: UserService) {}

	// Мои декораторы из auth/decorators
	@Get()
	@Auth()
	async profile(@CurrentUser('id') id: string) {
		return this.userService.getProfileWithStats(id)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Put()
	@Auth()
	async updateProfile(@CurrentUser('id') id: string, @Body() dto: UserDto) {
		return this.userService.update(id, dto)
	}
}
