import { MeetupModule } from './meetup.module';

describe('MeetupModule', () => {
  let meetupModule: MeetupModule;

  beforeEach(() => {
    meetupModule = new MeetupModule();
  });

  it('should create an instance', () => {
    expect(meetupModule).toBeTruthy();
  });
});
