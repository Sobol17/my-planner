import {
	BadGatewayException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { CookieOptions, Response } from 'express'
import { UserService } from 'src/user/user.service'
import { AuthDto } from './dto/auth.dto.js'

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private configService: ConfigService
	) {}

	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN_NAME = 'refreshToken'

	private getRefreshCookieOptions(expires: Date): CookieOptions {
		const isProduction = this.configService.get<string>('NODE_ENV') === 'production'
		const domain = this.configService.get<string>('DOMAIN')

		return {
			httpOnly: true,
			...(domain ? { domain } : {}),
			expires,
			secure: isProduction,
			// In production cross-site auth needs SameSite=None + Secure.
			// For local HTTP development use Lax, otherwise browser may block the cookie.
			sameSite: isProduction ? 'none' : 'lax'
		}
	}

	async login(dto: AuthDto) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.validateUser(dto)
		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	async register(dto: AuthDto) {
		const existingUser = await this.userService.getByPhone(dto.phone)

		if (existingUser) throw new BadGatewayException('User already exists')

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...user } = await this.userService.create(dto)

		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	private issueTokens(userId: string) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: '1d'
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		})

		return { accessToken, refreshToken }
	}

	private async validateUser(dto: AuthDto) {
		const user = await this.userService.getByPhone(dto.phone)

		if (!user) throw new NotFoundException('User not found')

		const isValid = await verify(user.password, dto.password)

		if (!isValid) throw new UnauthorizedException('Invalid password')

		return user
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync<{ id: string }>(refreshToken)

		if (!result) throw new UnauthorizedException('Invalid refresh token')

		const user = await this.userService.getById(result.id)
		if (!user) throw new UnauthorizedException('Invalid refresh token')

		const tokens = this.issueTokens(user.id)

		return {
			user,
			...tokens
		}
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(
			this.REFRESH_TOKEN_NAME,
			refreshToken,
			this.getRefreshCookieOptions(expiresIn)
		)
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(
			this.REFRESH_TOKEN_NAME,
			'',
			this.getRefreshCookieOptions(new Date(0))
		)
	}
}
