import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Kullanıcı bilgilerini getir' })
    @ApiParam({ name: 'id', description: 'Kullanıcı ID' })
    @ApiResponse({ status: 200, description: 'Kullanıcı bilgileri' })
    @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı' })
    @ApiResponse({ status: 401, description: 'Yetkisiz erişim' })
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findById(id);
        // Password'u response'dan çıkar
        const { password, ...result } = user;
        return result;
    }
}

