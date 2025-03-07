import { Ionicons } from "@expo/vector-icons";
import { React, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import {
  Layout,
  Section,
  SectionContent,
  Text,
  Button,
  Picker,
  themeColor,
} from "react-native-rapi-ui";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import { List } from "react-native-paper";

export default function ({ navigation }) {
  const [title, onChangeTitle] = useState("");

  // Rich Text Editor: https://dev.to/mintpw/how-to-use-react-native-rich-editor-on-react-native-22nk
  const richText = useRef();
  const [descHTML, setDescHTML] = useState("");
  const [showDescError, setShowDescError] = useState(false);

  // Collapsible dropdowns
  const [isCollapsedEvent, setIsCollapsedEvent] = useState(false);
  const [event, setEvent] = useState(null);
  const events = [
    { label: "Rain", value: "RAIN" },
    { label: "Snow", value: "SNOW" },
    { label: "Hail", value: "HAIL" },
    { label: "Strong winds", value: "WIND" },
  ];
  const [isCollapsedTask, setIsCollapsedTask] = useState(true);
  const [task, setTask] = useState(null);
  const tasks = [
    { label: "Fertilising", value: "FERT" },
    { label: "Watering", value: "WATR" },
    { label: "Planting", value: "PLNT" },
    { label: "Harvesting", value: "HVST" },
  ];

  const richTextHandle = (descriptionText) => {
    if (descriptionText) {
      setShowDescError(false);
      setDescHTML(descriptionText);
    } else {
      setShowDescError(true);
      setDescHTML("");
    }
  };

  const submitContentHandle = () => {
    const replaceHTML = descHTML.replace(/<(.|\n)*?>/g, "").trim();
    const replaceWhiteSpace = replaceHTML.replace(/&nbsp;/g, "").trim();

    if (replaceWhiteSpace.length <= 0) {
      setShowDescError(true);
    } else {
      setShowDescError(false);
      console.log("Title: ", title);
      console.log("Description: ", descHTML);
      console.log("Event: ", event);
      console.log("Task: ", task);

    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => richText.current?.dismissKeyboard()}
      accessible={false}
    >
      <Layout>
        <ScrollView contentContainerStyle={styles.view}>
          <Section style={styles.titleSection}>
            <TextInput
              style={[styles.titleInput]}
              onChangeText={onChangeTitle}
              value={title}
              placeholder="Enter Journal Title"
            />
          </Section>

          <Text
            size="xl"
            fontWeight="bold"
            style={{ marginTop: 24 }}
          >
            Journal Notes:
          </Text>
          <Section style={styles.richTextContainer}>
            <RichToolbar
              editor={richText}
              selectedIconTint="#873c1e"
              iconTint="#312921"
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.setStrikethrough,
                actions.setUnderline,
              ]}
              style={styles.richTextToolbarStyle}
            />
            <RichEditor
              ref={richText}
              onChange={richTextHandle}
              onFocus={() => setRichEditorFocused(true)}
              placeholder="Enter journal notes"
              androidHardwareAccelerationDisabled={true}
              style={styles.richTextEditorStyle}
              onStartShouldSetResponder={() => true}
              initialHeight={200}
            />
          </Section>

          {/* Record event/pest collapsible */}
          <Section style={styles.collabsibleSection}>
            <List.Accordion
              title="Record Event/Pest"
              expanded={!isCollapsedEvent}
              onPress={() => setIsCollapsedEvent(!isCollapsedEvent)}
            >
              <View style={styles.tableContainer}>
                <View style={styles.row}>
                  <Text style={{ flex: 1 }}>Type</Text>
                  <Picker
                    style={{ flex: 2 }}
                    items={events}
                    value={event}
                    placeholder="Select event"
                    onValueChange={(val) => setEvent(val)}
                  />
                </View>
                <View style={styles.row}>
                  <Text
                    style={{
                      flex: 1,
                      color: themeColor.white,
                      placeholderColor: themeColor.gray300,
                    }}
                  >
                    Notes
                  </Text>
                  <TextInput
                    style={{ flex: 2 }}
                    placeholder="Enter notes"
                  />
                </View>
              </View>
            </List.Accordion>
          </Section>

          {/* Log completed task collapsible */}
          <Section style={styles.collabsibleSection}>
            <List.Accordion
              style={styles.accordion}
              title="Log Completed Task"
              expanded={!isCollapsedTask}
              onPress={() => setIsCollapsedTask(!isCollapsedTask)}
            >
              <View style={styles.tableContainer}>
                <View style={styles.row}>
                  <Text
                    style={{
                      flex: 1,
                      color: themeColor.white,
                      placeholder: themeColor.gray300,
                    }}
                  >
                    Type
                  </Text>
                  <Picker
                    style={{ flex: 2 }}
                    items={tasks}
                    value={task}
                    placeholder="Select task"
                    onValueChange={(val) => setTask(val)}
                  />
                </View>
                <View style={styles.row}>
                  <Text style={{ flex: 1 }}>Notes</Text>
                  <TextInput
                    style={{ flex: 2 }}
                    placeholder="Enter notes"
                  />
                </View>
              </View>
            </List.Accordion>
          </Section>

          {/* Error output */}
          {/* {showDescError && (
            <Text style={styles.errorTextStyle}>
              Please enter some journal notes
            </Text>
          )} */}

          <Button
            text="Submit"
            onPress={submitContentHandle}
            status="primary"
            type="TouchableOpacity"
            rightContent={
              <Ionicons
                name="arrow-forward"
                size={20}
                color={themeColor.white}
              />
            }
          />
        </ScrollView>
      </Layout>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    margin: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  titleSection: {
    width: "100%",
  },
  titleInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  richTextContainer: {
    display: "flex",
    flexDirection: "column-reverse",
    width: "100%",
    marginBottom: 20,
  },
  richTextEditorStyle: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: "#ccaf9b",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    fontSize: 20,
  },
  richTextToolbarStyle: {
    backgroundColor: "#c6c3b3",
    borderColor: "#c6c3b3",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
  },
  errorTextStyle: {
    color: "#FF0000",
    marginBottom: 10,
  },
  collabsibleSection: {
    width: "100%",
    marginBottom: 20,
  },
  accordion: {
    color: themeColor.dark,
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  cell: {
    flex: 1,
    fontSize: 16,
    padding: 5,
  },
});
