import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Text,
  HelperText,
  Divider,
} from 'react-native-paper';
import { StorageService } from '../utils/storage';
import { theme, spacing } from '../styles/theme';

export default function ImportDataScreen({ navigation }) {
  const [importData, setImportData] = useState('');
  const [loading, setLoading] = useState(false);

  const validateJsonData = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.products || !Array.isArray(data.products)) {
        return 'Invalid format: products array not found';
      }
      return null;
    } catch (error) {
      return 'Invalid JSON format';
    }
  };

  const handleImport = async () => {
    const validationError = validateJsonData(importData);
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    Alert.alert(
      'Import Data',
      'This will replace all existing data. Are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          style: 'destructive',
          onPress: performImport,
        },
      ]
    );
  };

  const performImport = async () => {
    setLoading(true);

    try {
      const success = await StorageService.importData(importData);
      if (success) {
        Alert.alert(
          'Success',
          'Data imported successfully',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Error', 'Failed to import data');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to import data');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImportData('');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Import Inventory Data</Title>
          
          <Text style={styles.description}>
            Paste your exported JSON data below to restore your inventory. 
            This will replace all existing data.
          </Text>

          <Divider style={styles.divider} />

          <TextInput
            label="JSON Data"
            value={importData}
            onChangeText={setImportData}
            mode="outlined"
            multiline
            numberOfLines={10}
            style={styles.textInput}
            placeholder="Paste your exported JSON data here..."
          />

          <HelperText type="info" visible={true}>
            The data should be in the format exported by this app
          </HelperText>

          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Data Preview:</Text>
            {importData ? (
              <View>
                <Text style={styles.previewText}>
                  {importData.length} characters
                </Text>
                {(() => {
                  try {
                    const parsed = JSON.parse(importData);
                    return (
                      <Text style={styles.previewText}>
                        {parsed.products?.length || 0} products found
                      </Text>
                    );
                  } catch {
                    return (
                      <Text style={[styles.previewText, styles.errorText]}>
                        Invalid JSON format
                      </Text>
                    );
                  }
                })()}
              </View>
            ) : (
              <Text style={styles.previewText}>No data entered</Text>
            )}
          </View>
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleImport}
          loading={loading}
          disabled={loading || !importData.trim()}
          style={styles.importButton}
        >
          Import Data
        </Button>

        <Button
          mode="outlined"
          onPress={handleClear}
          disabled={loading}
          style={styles.clearButton}
        >
          Clear
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    margin: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: spacing.md,
    color: theme.colors.placeholder,
  },
  divider: {
    marginVertical: spacing.md,
  },
  textInput: {
    marginBottom: spacing.sm,
    minHeight: 200,
  },
  previewContainer: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  previewTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  previewText: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  errorText: {
    color: theme.colors.error,
  },
  buttonContainer: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  importButton: {
    backgroundColor: theme.colors.primary,
  },
  clearButton: {
    borderColor: theme.colors.placeholder,
  },
});