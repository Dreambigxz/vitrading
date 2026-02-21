import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-ai-icon',
  imports: [CommonModule],
  templateUrl: './ai-icon.component.html',
  styleUrl: './ai-icon.component.css'
})
export class AiIconComponent {
  @Input() type: string = 'wallet';

}
