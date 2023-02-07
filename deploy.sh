docker build -t phuocthien-site .

# login registry
docker login -u devpt1 -p devpt 103.153.72.230:5000

# tag version
docker image tag phuocthien-site 103.153.72.230:5000/pt/phuocthien-site:lastest

# push registry
docker push 103.153.72.230:5000/pt/phuocthien-site:lastest