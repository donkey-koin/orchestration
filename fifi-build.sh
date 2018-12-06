docker build . -t donkey-koin/orchestration:latest
docker tag donkey-koin/orchestration:latest localhost:6000/donkey-koin/orchestration:latest
docker push localhost:6000/donkey-koin/orchestration:latest

