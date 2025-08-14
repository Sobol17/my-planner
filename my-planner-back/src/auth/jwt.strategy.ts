import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from './../user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService,
		private userService: UserService
	) {
		const secretOrKey = configService.get<string>('JWT_SECRET')

		if (!secretOrKey) {
			throw new Error('JWT_SECRET is not set')
		}
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: true,
			secretOrKey
		})
	}

	async validate({ id }: { id: string }) {
		return this.userService.getById(id)
	}
}
