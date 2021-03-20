import { Body, Controller, Get, Post, Route, SuccessResponse } from 'tsoa';
import TricksService from './tricks.service';
import { CreateTrickDto, TrickDto } from './tricks.types';

@Route('tricks')
export class TricksController extends Controller {
    @SuccessResponse('201', 'Created')
    @Post()
    public async createTrick(@Body() requestBody: CreateTrickDto): Promise<void> {
        this.setStatus(201);
        await new TricksService().createTrick(requestBody);
    }

    @Get()
    public async getTricks(): Promise<TrickDto[]> {
        return await new TricksService().getAllTricks();
    }
}
