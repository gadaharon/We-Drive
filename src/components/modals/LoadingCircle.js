import React from 'react';
import { View, ActivityIndicator, Modal } from 'react-native';

const LoadingCircle = (props) => {
    const { visable, visableHandler} = props;
    return(
        <Modal transparent visible={visable} onRequestClose={() => console.log('Loading')}>
            <View style={styles.container}>
                <ActivityIndicator size={75} color="#ADD8E6" />
            </View>
        </Modal>
    );
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.8)'
    }
}

export default LoadingCircle