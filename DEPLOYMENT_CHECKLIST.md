# Astrarium Deployment Checklist

## Pre-Launch Checklist

### Environment Setup
- [ ] Backend `.env` file created with:
  - [ ] `OPENAI_API_KEY` set
  - [ ] `DATABASE_URL` configured
  - [ ] `ALLOWED_ORIGINS` includes frontend URL
- [ ] Frontend `.env` verified:
  - [ ] `NEXT_PUBLIC_API_URL` points to backend
  - [ ] Supabase credentials present

### Dependencies
- [ ] Backend: `pip install -r requirements.txt` completed
- [ ] Frontend: `pnpm install` completed
- [ ] All Radix UI components installed
- [ ] No missing dependencies errors

### Database
- [ ] SQLite database created (auto-generated on first run)
- [ ] All tables created (users, skills, questions, pets, etc.)
- [ ] Test user can be created successfully

### API Integration
- [ ] Backend starts without errors on port 8000
- [ ] Frontend can reach backend API
- [ ] CORS configured correctly
- [ ] Test API call successful

### Authentication Flow
- [ ] Signup creates user in Supabase
- [ ] Signup creates user in Astrarium backend
- [ ] Alien pet auto-created on signup
- [ ] Login syncs tokens correctly
- [ ] Logout clears tokens
- [ ] Protected routes work

### Core Features
- [ ] Pet displays with correct stats
- [ ] Skills can be added
- [ ] Skills list shows with health scores
- [ ] AI recommendations load
- [ ] Questions generate successfully
- [ ] Answers can be submitted
- [ ] Feedback dialog shows results
- [ ] Pet stats update after practice
- [ ] XP and levels increase
- [ ] Streak counter works

### UI/UX
- [ ] Cosmic theme applied consistently
- [ ] All buttons functional
- [ ] Dialogs open/close properly
- [ ] Loading states show
- [ ] Error handling graceful
- [ ] Mobile responsive (bonus)

## Testing Scenarios

### Scenario 1: New User Journey
1. [ ] Sign up with new email
2. [ ] Redirected to success page
3. [ ] Login successfully
4. [ ] See empty skills list
5. [ ] Pet displays (Level 1, Egg stage)
6. [ ] User stats show 0 XP, 0 streak

### Scenario 2: Add First Skill
1. [ ] Click "Add Skill"
2. [ ] Enter skill name: "Docker"
3. [ ] Set proficiency to 5
4. [ ] Save successfully
5. [ ] Skill appears in list
6. [ ] Health score at 100
7. [ ] Practice button visible

### Scenario 3: Practice Session
1. [ ] Click "Practice Now"
2. [ ] Question loads (may take 3-5 seconds for AI)
3. [ ] Question displays with options (if MC)
4. [ ] Select/enter answer
5. [ ] Submit answer
6. [ ] Feedback dialog appears
7. [ ] XP shown earned
8. [ ] Pet luminosity changed
9. [ ] Skill health updated
10. [ ] Dashboard refreshes

### Scenario 4: Recommendations
1. [ ] Add multiple skills with different last_used dates
2. [ ] Click "Recommendations" tab
3. [ ] AI analyzes skills
4. [ ] Recommendations appear sorted by urgency
5. [ ] Can practice from recommendations

### Scenario 5: Pet Evolution
1. [ ] Practice multiple times
2. [ ] Earn 100+ XP
3. [ ] User levels up
4. [ ] Pet level increases
5. [ ] Pet evolves to Larvae (at level 6)
6. [ ] Pet mood reflects health

## Known Limitations

### Backend Auth
- ⚠️ Using basic password hashing (not production-ready)
- ⚠️ Auth tokens are simple (not JWT)
- 💡 Works for demo, needs upgrade for production

### Session Sync
- ⚠️ Password not stored client-side for re-auth
- 💡 May need to re-login after page refresh
- 💡 Can be fixed with JWT implementation

### AI Response Time
- ⚠️ Question generation takes 3-5 seconds
- 💡 OpenAI API latency
- 💡 Consider caching common questions

## Performance Optimizations

### Current
- ✅ Component-level loading states
- ✅ Refresh keys prevent stale data
- ✅ React hooks for efficient updates
- ✅ No unnecessary re-renders

### Future
- [ ] Add React Query for caching
- [ ] Implement optimistic updates
- [ ] Prefetch recommendations
- [ ] Cache generated questions
- [ ] Add service worker for offline

## Production Deployment Considerations

### Security Hardening
- [ ] Implement JWT authentication
- [ ] Add bcrypt password hashing
- [ ] Enable rate limiting
- [ ] Add input sanitization
- [ ] Configure HTTPS only
- [ ] Restrict CORS to specific domains
- [ ] Add API key rotation

### Database
- [ ] Migrate from SQLite to PostgreSQL
- [ ] Set up database backups
- [ ] Add migration system
- [ ] Index frequently queried fields

### Scaling
- [ ] Add Redis for caching
- [ ] Set up load balancer
- [ ] Configure CDN for static assets
- [ ] Implement database connection pooling

### Monitoring
- [ ] Add error tracking (Sentry)
- [ ] Set up logging
- [ ] Add analytics
- [ ] Monitor API usage
- [ ] Track AI costs

### Environment
- [ ] Set up staging environment
- [ ] Configure CI/CD pipeline
- [ ] Add automated tests
- [ ] Set up environment variables management

## Demo Day Checklist

### Before Demo
- [ ] Backend running smoothly
- [ ] Frontend loaded in browser
- [ ] Test user account ready
- [ ] Sample skills pre-added
- [ ] Pet visible and healthy
- [ ] Internet connection stable (for AI)
- [ ] Screen sharing tested

### During Demo
- [ ] Show landing page
- [ ] Walk through signup
- [ ] Demonstrate skill addition
- [ ] Show AI recommendations
- [ ] Run live practice session
- [ ] Display pet evolution
- [ ] Highlight streak system
- [ ] Show spaced repetition schedule

### Talking Points
1. "Prevents skill decay using forgetting curve theory"
2. "AI generates personalized questions for any skill"
3. "Spaced repetition like Anki for optimal retention"
4. "Gamification with evolving alien pets"
5. "Built for tech workers who drift between technologies"

## Emergency Troubleshooting

### Backend Won't Start
```bash
# Check Python version
python --version  # Should be 3.10+

# Recreate venv
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### AI Questions Not Generating
1. Check OpenAI API key in `.env`
2. Verify API quota/billing
3. Check backend logs for errors
4. Try with different skill name
5. Fallback: Backend has hardcoded fallback questions

### Database Errors
```bash
# Delete and regenerate
rm astral_pet.db
# Restart backend (auto-creates tables)
```

### CORS Errors
- Check `ALLOWED_ORIGINS` in backend `.env`
- Ensure frontend URL matches exactly
- Restart backend after changes

## Success Criteria

Your demo is ready when:
- ✅ You can signup → add skill → practice → see pet evolve
- ✅ All 3 main views work (Pet, Skills, Recommendations)
- ✅ AI generates questions successfully
- ✅ Pet health changes based on answers
- ✅ UI looks polished with cosmic theme
- ✅ No console errors visible

## Final Notes

**Time to First Demo**: ~5 minutes after install
**Most Impressive Feature**: AI-generated questions for any skill
**Unique Value Prop**: Gamified spaced repetition for skill retention

Good luck! Your cosmic companion awaits! 🚀🌟
