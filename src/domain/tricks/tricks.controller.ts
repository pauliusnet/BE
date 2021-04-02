import { Body, Controller, Get, Post, Route, Security, SuccessResponse } from 'tsoa';
import { CreateTrickDto, TrickDto } from './tricks.types';
import TricksService from './tricks.service';

@Route('tricks')
export class TricksController extends Controller {
    tricksService = new TricksService();

    @SuccessResponse('201', 'Created')
    @Security('jwt', ['admin'])
    @Post()
    public async createTrick(@Body() requestBody: CreateTrickDto): Promise<void> {
        this.setStatus(201);
        await this.tricksService.createTrick(requestBody);
    }

    @Get()
    public async getTricks(): Promise<TrickDto[]> {
        return await this.tricksService.getAllTricks();
    }
}
