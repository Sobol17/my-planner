import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../guards/jwt.guard.js'

export const Auth = () => UseGuards(JwtAuthGuard)
