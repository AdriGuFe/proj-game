import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GamesService } from './services/games.service';
import { Game } from './models/game';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'proj-game';

  game: Game[] = [];

  loading = true;
  error = false;

  encontrado: Game | null = null;
  buscando = false;
  noEncontrado = false;

  private gamesService = inject(GamesService)

  tilt(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty('--rx', `${(0.5 - y) * 18}deg`);
    card.style.setProperty('--ry', `${(x - 0.5) * 18}deg`);
    card.style.setProperty('--mx', `${x * 100}%`);
    card.style.setProperty('--my', `${y * 100}%`);
  }

  resetTilt(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  }

  ngOnInit(): void{
    this.gamesService.getGames().subscribe({
      next: (game : Game[]) => {
        this.game = game;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  onBuscarId(id: string) {
    if (!id.trim()) return;
    this.buscando = true;
    this.noEncontrado = false;
    this.encontrado = null;
    this.gamesService.getGameById(+id).subscribe({
      next: (game: Game) => {
        this.encontrado = game;
        this.buscando = false;
      },
      error: () => {
        this.noEncontrado = true;
        this.buscando = false;
      }
    });
  }

  limpiarBusqueda(input: HTMLInputElement) {
    input.value = '';
    this.encontrado = null;
    this.noEncontrado = false;
  }
}
