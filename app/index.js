import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity
} from "react-native";

const CATEGORIES = ["Trabalho", "Pessoal", "Família"]

export default function HomeScreen() {
  const [contacts, setContacts] = useState([]); // Lista de contatos
  const [modalVisible, setModalVisible] = useState(false); // Modal visível ou não
  const [newContact, setNewContact] = useState(""); // Texto do nova contato
  const [newContactNumber, setNewContactNumber] = useState(""); // Texto do nova contato
  const [newContactCategory, setNewContactCategory] = useState(""); // Texto do nova contato
  const [editIndex, setEditIndex] = useState(null); // Índice do contato em edição

  // Função para adicionar ou editar contato
  function addOrEditContact() {
    if (!newContact) return; // Se o campo estiver vazio (sem espaços ou texto), não faz nada

    if (editIndex === null) {
      // Adiciona um novo contato diretamente ao estado
      contacts.push(newContact); // Modifica o array diretamente
      contacts.push(newContactNumber); // Modifica o array diretamente
      contacts.push(newContactCategory); // Modifica o array diretamente
    } else {
      // Edita um contato existente
      contacts[editIndex] = newContact; // Atualiza  contato no índice de edição
      contacts[editIndex] = newContactNumber; // Atualiza  contato no índice de edição
      contacts[editIndex] = newContactCategory; // Atualiza  contato no índice de edição
      setEditIndex(null); // Limpa o índice de edição
    }

    setContacts(contacts); // Atualiza o estado com a lista de contatos modificada
    setNewContact(""); // Limpa o campo de texto
    setNewContactNumber(""); // Limpa o campo de texto
    setNewContactCategory(""); // Limpa o campo de texto
    setModalVisible(false); // Fecha o modal
  }

  // Função para confirmar exclusão de contato
  function confirmDelete(index) {
    Alert.alert("Excluir contato?", `Remover "${contacts[index]}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          contacts.splice(index, 1); // Remove a contato diretamente do array
          setContacts(contacts); // Atualiza o estado com a lista modificada
        },
      },
    ]);
  }

  // Função para abrir o modal em modo de edição
  function openEditModal(index) {
    setNewContact(contacts[index]); // Carrega o texto da contato no campo de edição
    setNewContactNumber(contacts[index]); // Carrega o texto da contato no campo de edição
    setNewContactCategory(contacts[index]); // Carrega o texto da contato no campo de edição
    setEditIndex(index); // Define o índice da contato a ser editada
    setModalVisible(true); // Abre o modal
  }

  return (
    <View style={styles.container}>
      {/* Botão para abrir o modal */}
      <Pressable
        onPress={() => {
          setNewContact("");
          setNewContactNumber("");
          setNewContactCategory("");
          setEditIndex(null);
          setModalVisible(true);
        }}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>+ Novo Contato</Text>
      </Pressable>

      {/* Lista de contatos */}
      <FlatList
        data={contacts}
        keyExtractor={(_, i) => String(i)} // Identificador único para cada item
        renderItem={({ item, index }) => (
          <View style={styles.contactItemContainer}>
            <Text style={styles.contactItem}>{item}</Text>
            <View style={styles.contactButtons}>
              {/* Botões para editar e excluir */}
              <Pressable
                onPress={() => openEditModal(index)} // Abre o modal para editar
                style={[styles.contactButton, styles.editButton]}
              >
                <Text style={styles.buttonText}>✏️</Text>
              </Pressable>
              <Pressable
                onPress={() => confirmDelete(index)} // Exclui o contato
                style={[styles.contactButton, styles.deleteButton]}
              >
                <Text style={styles.buttonText}>🗑️</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum contato criado!</Text>
        }
      />

      {/* Modal para adicionar ou editar contato */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={{ marginBottom: 8 }}>
              {editIndex === null
                ? "Digite seu novo contato:"
                : "Edite a contato:"}
            </Text>
            <TextInput
              value={newContact} // O valor do campo de texto é controlado pelo estado `newContact`
              onChangeText={setNewContact} // Atualiza o estado com o novo texto
              placeholder="Ex: Nome do Contato"
              style={styles.input}
            />
            <TextInput
              value={newContactNumber} // O valor do campo de texto é controlado pelo estado `newContact`
              onChangeText={setNewContactNumber} // Atualiza o estado com o novo texto
              placeholder="Ex: Telefone"
              keyboardType="phone-pad"
              style={styles.input}
            />

            <Text style={{ marginBottom: 8 }}>Categoria:</Text>
            <View style={styles.radioGroup}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setNewContactCategory(cat)}
                  style={[
                    styles.radioButton,
                    newContactCategory === cat && styles.radioButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.radioText,
                      newContactCategory === cat && styles.radioTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>


            <Pressable onPress={addOrEditContact} style={{ marginBottom: 8 }}>
              <Text style={{ color: "#187C19", textAlign: "center" }}>
                {editIndex === null ? "Adicionar" : "Salvar alterações"}
              </Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={{ color: "#999", textAlign: "center" }}>
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    marginBottom: 16,
    alignSelf: "center",
    backgroundColor: "#8DC71E", // Vermelho (Pantone 485)
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  contactItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 6,
  },
  contactItem: {
    flex: 1,
    fontSize: 12,
  },
  contactButtons: {
    flexDirection: "row",
  },
  contactButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 4,
  },
  editButton: {
    backgroundColor: "#ffca28", // Cor de edição (amarelo)
  },
  deleteButton: {
    backgroundColor: "#f44336", // Cor de exclusão (vermelho)
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    color: "#666",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Fundo escuro com transparência
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
},
radioButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 6,
},
radioButtonSelected: {
    backgroundColor: "#8DC71E",
    borderColor: "#8DC71E",
},
radioText: {
    color: "#333",
},
radioTextSelected: {
    color: "#fff",
    fontWeight: "bold",
},
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
});
