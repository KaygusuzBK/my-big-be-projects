import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Kullanıcı kaydı' })
    @ApiResponse({ status: 201, description: 'Kullanıcı başarıyla kaydedildi' })
    @ApiResponse({ status: 409, description: 'Email zaten kullanılıyor' })
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Kullanıcı girişi' })
    @ApiResponse({ status: 200, description: 'Giriş başarılı' })
    @ApiResponse({ status: 401, description: 'Geçersiz kimlik bilgileri' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Kullanıcı profili' })
    @ApiResponse({ status: 200, description: 'Profil bilgileri' })
    @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
    async getProfile(@Request() req) {
        return req.user;
    }
}
