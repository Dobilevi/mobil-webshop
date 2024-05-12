import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteUserDialogueComponent } from './delete-user-dialogue.component';

describe('DeleteUserDialogueComponent', () => {
  let component: DeleteUserDialogueComponent;
  let fixture: ComponentFixture<DeleteUserDialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteUserDialogueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteUserDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
