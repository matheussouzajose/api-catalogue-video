import {
  Controller,
  Post,
  Body,
  Inject,
  Get,
  Param,
  ParseUUIDPipe,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { SaveCategoryDto } from './dto/save-category.dto';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './categories.presenter';
import { CategoryOutput } from '@core/category/application/use-cases/common/category-output';
import { SaveCategoryUseCase } from '@core/category/application/use-cases/save-category/save-category.use-case';
import { GetCategoryUseCase } from '@core/category/application/use-cases/get-category/get-category.use-case';
import { DeleteCategoryUseCase } from '@core/category/application/use-cases/delete-category/delete-category.use-case';
import { ListAllCategoriesUseCase } from '@core/category/application/use-cases/list-all-categories/list-all-categories.use-case';

@Controller('categories')
export class CategoriesController {
  @Inject(SaveCategoryUseCase)
  private saveUseCase: SaveCategoryUseCase;

  @Inject(DeleteCategoryUseCase)
  private deleteUseCase: DeleteCategoryUseCase;

  @Inject(GetCategoryUseCase)
  private getUseCase: GetCategoryUseCase;

  @Inject(ListAllCategoriesUseCase)
  private listUseCase: ListAllCategoriesUseCase;

  @Post()
  async create(
    @Body() createCategoryDto: SaveCategoryDto,
  ): Promise<{ id: string; created: boolean }> {
    return this.saveUseCase.execute(createCategoryDto);
  }

  @Get()
  async search() {
    const output = await this.listUseCase.execute();
    return new CategoryCollectionPresenter(output);
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ): Promise<CategoryPresenter> {
    const output = await this.getUseCase.execute({ id });
    return CategoriesController.serialize(output);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string,
  ): Promise<void> {
    return this.deleteUseCase.execute({ id });
  }

  static serialize(output: CategoryOutput): CategoryPresenter {
    return new CategoryPresenter(output);
  }
}
