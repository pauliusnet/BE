import { Body, Controller, Delete, Get, Patch, Path, Post, Route, Security, SuccessResponse } from 'tsoa';
import { CreateTrickDto, TrickDto, UpdateTrickDto } from './tricks.types';
import TricksService from './tricks.service';
import { SecurityMethod } from '../../entities/role-entity.types';
import { TrickDoesNotExist } from './tricks.repository.errors';
import { BadRequest } from '../../common/common.errors';

@Route('tricks')
export class TricksController extends Controller {
    tricksService = new TricksService();

    @SuccessResponse('201', 'Created')
    @Security(SecurityMethod.Jwt)
    @Post()
    public async createTrick(@Body() requestBody: CreateTrickDto): Promise<void> {
        this.setStatus(201);
        await this.tricksService.createTrick(requestBody);
    }

    @Get()
    public async getTricks(): Promise<TrickDto[]> {
        return await this.tricksService.getAllTricks();
    }

    @Delete('/{id}')
    @Security(SecurityMethod.Jwt)
    public async deleteTrickById(@Path() id: number): Promise<void> {
        try {
            await this.tricksService.deleteTrickById(id);
        } catch (error) {
            if (error instanceof TrickDoesNotExist) {
                throw new BadRequest('Trick with provided id does not exist');
            }
            throw error;
        }
    }

    @Patch('/{id}')
    @Security(SecurityMethod.Jwt)
    public async updateTrickById(@Path() id: number, @Body() requestBody: UpdateTrickDto): Promise<TrickDto> {
        try {
            return await this.tricksService.updateTrickById(id, requestBody);
        } catch (error) {
            if (error instanceof TrickDoesNotExist) {
                throw new BadRequest('Trick with provided id does not exist');
            }
            throw error;
        }
    }
}
