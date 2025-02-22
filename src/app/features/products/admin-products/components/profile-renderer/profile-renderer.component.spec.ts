import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRendererComponent } from './profile-renderer.component';

describe('ProfileRendererComponent', () => {
  let component: ProfileRendererComponent;
  let fixture: ComponentFixture<ProfileRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileRendererComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfileRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
