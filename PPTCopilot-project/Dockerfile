FROM node:16

WORKDIR /home/app

COPY . . 

RUN npm install --legacy-peer-deps

EXPOSE 9529

# 如果arg server_ip不为空，则替换配置文件中的server_ip
ARG SERVER_IP=127.0.0.1
# 运行env.py传递参数
RUN python3 env.py $SERVER_IP

CMD ["npm", "run", "dev", "--", "--port", "9529"]
