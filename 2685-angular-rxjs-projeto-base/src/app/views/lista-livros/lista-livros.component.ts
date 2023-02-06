import { LivrosResultado } from 'src/app/models/interfaces';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { catchError, debounceTime, EMPTY, filter, map, of, switchMap, throwError } from 'rxjs';
import { Item } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';

import { LivroService } from './../../service/livro.service';

const PAUSA = 300;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent{

  campoBusca = new FormControl();
  mensagemErro = '';
  livroResultado : LivrosResultado;

  constructor(private service: LivroService) { }

  totalDeLivros$ = this.campoBusca.valueChanges.pipe (
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map(resultado => this.livroResultado = resultado),
    catchError(erro => {
      return of();
    })
  )

  //é convenção que quando se declara uma variável no observable se coloque o símbolo de $ no final;
    livrosEncontrados$ = this.campoBusca.valueChanges.pipe (
      debounceTime(PAUSA),
      filter((valorDigitado) => valorDigitado.length >= 3),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
      map(resultado => resultado.items ?? []),
      map((items) => this.livrosResultado(items)),
      catchError((erro) => {
        this.mensagemErro = 'Ops! Ocorreu um erro. Recarregue a aplicação!'
       // return EMPTY; // EMPTY faz um callback e age como um complete completando o ciclo de vida do observable
        console.log(erro)
        return throwError(() => new Error(this.mensagemErro = 'Ops! Ocorreu um erro. Recarregue a aplicação!'))
      })
    )


  livrosResultado(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }

}





