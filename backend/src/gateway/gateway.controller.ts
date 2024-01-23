import {
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Put,
    UseGuards,
  } from '@nestjs/common';
  import { ApiOperation, ApiTags } from '@nestjs/swagger';
  import { Jwt2faAuthGuard } from 'src/2fa/guard';
import { GatewayService } from './gateway.service';


@UseGuards(Jwt2faAuthGuard)
@Controller('gateway')
@ApiTags('gateway')
export class GatewayController {
    constructor(
        private gateway: GatewayService,
    ) {}

    @ApiOperation({ summary: 'get user status.' })
    @Get('status/:intraId')
    async status(@Param('intraId', ParseIntPipe) intraId: number): Promise<any> {
        console.log("intraId in gateway controller:", intraId);
        if (await this.gateway.get_socket_from_user(intraId) === undefined) {
            return {online: false};
        }
        return {online: true};
    }
}
