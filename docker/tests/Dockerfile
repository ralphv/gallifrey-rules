FROM confluentinc/cp-kafka-connect:7.2.1

# Install the JDBC Connector plugin
RUN confluent-hub install --no-prompt confluentinc/kafka-connect-jdbc:latest

# Set plugin path
ENV CONNECT_PLUGIN_PATH=/usr/share/java,/usr/share/confluent-hub-components
