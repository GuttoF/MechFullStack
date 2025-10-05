.PHONY: up down restart build logs ps seed test typecheck lint curl-api curl-admin clean prune

COMPOSE=docker compose

up:
	$(COMPOSE) up -d

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

build:
	$(COMPOSE) build --no-cache

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

# Semear contas (admin, usuário e médicos)
seed:
	$(COMPOSE) exec -T backend node -e "(async()=>{ const mongoose=require('mongoose'); const bcrypt=require('bcrypt'); const uri=(process.env.MONGODB_URI||'mongodb://mongo:27017')+'/mech'; await mongoose.connect(uri); const User=(await import('./dist/models/userModel.js')).default; const Doctor=(await import('./dist/models/doctorModel.js')).default; const ensureUser=async (name,email,pass)=>{ const existing=await User.findOne({email}); if(existing) return; const hash=bcrypt.hashSync(pass,10); await User.create({name,email,password:hash,image:'',phone:'000000000',address:{line1:'',line2:''},gender:'Not Selected',dob:'Not Selected'}); }; await ensureUser('Admin','admin@admin.com','admin'); await ensureUser('User Test','usertest@test.com','test'); const ensureDoc=async (d)=>{ const e=await Doctor.findOne({email:d.email}); if(e) return; d.password=bcrypt.hashSync(d.password,10); d.date=Date.now(); d.slots_booked={}; await Doctor.create(d); }; const baseAddr={line1:'Av. José Rodrigues de Jesus, Indianópolis', line2:'Caruaru - PE'}; const docs=[ {name:'Dra. Ana Souza', email:'ana.souza@mech.com', password:'doctor', image:'/assets/doc15-wRQogShG.png', speciality:'General physician', degree:'CRM-PE', experience:'5 Years', about:'Clínica geral com foco em medicina preventiva.', fees:200, address:baseAddr}, {name:'Dra. Beatriz Lima', email:'beatriz.lima@mech.com', password:'doctor', image:'/assets/doc2-Y_tw-_wb.png', speciality:'Gynecologist', degree:'CRM-PE', experience:'7 Years', about:'Ginecologia e saúde da mulher.', fees:250, address:baseAddr}, {name:'Dr. Carlos Pereira', email:'carlos.pereira@mech.com', password:'doctor', image:'/assets/doc3-D46sSx07.png', speciality:'Dermatologist', degree:'CRM-PE', experience:'4 Years', about:'Dermatologia clínica e estética.', fees:220, address:baseAddr}, {name:'Dr. DOOM', email:'diego.martins@mech.com', password:'doctor', image:'/assets/doc14-DFAA3xQf.png', speciality:'Neurologist', degree:'CRM-PE', experience:'6 Years', about:'Neurologia clínica.', fees:300, address:baseAddr}, {name:'Dr. Luís Inácio', email:'elisa.rocha@mech.com', password:'doctor', image:'/assets/doc7-Jj6FmILj.png', speciality:'Pediatricians', degree:'CRM-PE', experience:'3 Years', about:'Pediatria geral.', fees:180, address:baseAddr}, {name:'Dr. Felipe Azevedo', email:'felipe.azevedo@mech.com', password:'doctor', image:'/assets/doc6-BBgIGkd-.png', speciality:'Gastroenterologist', degree:'CRM-PE', experience:'8 Years', about:'Gastroenterologia.', fees:260, address:baseAddr} ]; for(const d of docs){ await ensureDoc(d);} console.log('Seed OK'); process.exit(0); })().catch(e=>{ console.error(e); process.exit(1); })"

# Utilitários rápidos
curl-api:
	curl -s http://localhost:8080/api/doctor/list | jq .

curl-admin:
	@echo "Acesse http://localhost:8080/admin"

test:
	cd backend && npm test --silent

typecheck:
	cd backend && npm run typecheck && cd ../frontend && npm run typecheck && cd ../admin && npm run typecheck

lint:
	cd frontend && npm run lint && cd ../admin && npm run lint

clean:
	$(COMPOSE) down -v --remove-orphans

prune:
	docker system prune -f --volumes


