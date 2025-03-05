import clsx from "clsx";
import { IoIosArrowForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { Button, ContextMenu } from "@base/index";
import { getNews } from "@modules/index";
import { openUrl } from "@tauri-apps/plugin-opener";
import { parseDate, Config } from "@utils/index";
import { LazyStore } from "@tauri-apps/plugin-store";
import { useTranslation } from "react-i18next";

const items = [
  { label: "Option 1", onClick: () => alert("Option 1") },
  { label: "Option 2", onClick: () => alert("Option 2") },
];

const LeftBar = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [config, setConfig] = useState<UiConfig>();
  const [news, setNews] = useState<News[]>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState<string>("");
  const noteStore = new LazyStore("./notes.json");
  const { t } = useTranslation();

  async function addNote(note: string) {
    const newNote = {
      id: crypto.randomUUID(),
      data: note,
    };
    setNotes([newNote, ...notes]);
    await noteStore.set("notes", [newNote, ...notes]);
  }

  async function deleteNote(id: string) {
    const updatedNotes = notes.filter((el) => el.id !== id);
    setNotes(updatedNotes);
    await noteStore.set("notes", updatedNotes);
  }

  function format(text: string) {
    return text.replace(/\n/g, "<br />");
  };

  async function startEditing(id: string, text: string) {
    setEditingId(id);
    setEditedText(text);
  };

  async function saveEditing(id: string) {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, data: editedText } : note
    );
    setNotes(updatedNotes);
    await noteStore.set("notes", updatedNotes);
    setEditingId(null);
  };

  useEffect(() => {
    const loadConfigAndData = async () => {
      const uiConfig = await new Config().getUiConfig();
      setConfig(uiConfig);

      if (uiConfig?.leftBarContent === "news") {
        const newsData = await getNews();
        const sortedNews = newsData.sort((a, b) => {
          const dateA = parseDate(a.time);
          const dateB = parseDate(b.time);
          return dateB.getTime() - dateA.getTime();
        });
        setNews(sortedNews);
      }

      if (uiConfig?.leftBarContent === "notes") {
        const noteList = (await noteStore.get<Note[]>("notes")) || [];
        setNotes(noteList);
      }
    };

    loadConfigAndData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  const className = clsx(
    "absolute bg-black/75 h-full w-[390px] translation duration-300 ease-[cubic-bezier(0.8,0.05,0.05,0.8)] flex flex-col z-30 bg-[url(/src/assets/bg.png)] bg-center bg-no-repeat bg-cover pr-16",
    open ? "left-0" : "left-[-326px]"
  );

  const arrowClassName = clsx(
    "w-[42px] h-[42px] m-2 translation absolute right-0 bottom-0 duration-300 ease-[cubic-bezier(0.8,0.05,0.05,0.8)] hover:bg-white/25 rounded-lg",
    open && "-rotate-180"
  );

  return (
    <>
      <div ref={menuRef} className={className} onClick={() => setOpen(true)}>
        <div className="place-items-end">
          <IoIosArrowForward
            className={arrowClassName}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          />
        </div>
        {config?.leftBarContent == "none" && (
          <div className="overflow-y-auto scrollbar-hidden grid gap-4 pt-16 pl-16">
            <ContextMenu items={items}>
              <div className="bg-black/50 p-5 rounded-lg">
                {t("blob")}
              </div>
            </ContextMenu>
          </div>
        )}
        {config?.leftBarContent == "news" && (
          <div className="overflow-y-auto h-full scrollbar-hidden flex flex-col pt-8 pl-8">
            {news?.map((element, index) => (
              <div
                className="relative flex flex-col bg-black/50 rounded-lg overflow-clip mb-8 border border-[#3a3a3a] backdrop-blur-sm"
                key={index}
              >
                {element.image && (
                  <img
                    src={element.image}
                    className="absolute w-full inset-0 mask-gradient"
                  />
                )}
                <h1 className={`z-10 px-2 ${element.image ? "pt-[100px]" : "pt-4"}`}>
                  {element?.data}
                </h1>
                {element.desc && (
                  <div className="z-10 font-second px-4 py-2 text-justify text-[#dddddd]">
                    {element.desc}
                  </div>
                )}
                {element.url && (
                  <a
                    className="ml-auto text-[#b8b8b8] pr-4 pb-4 cursor-pointer font-second hover:text-ak-yellow transition duration-150"
                    onClick={async () => await openUrl(element.url as string)}
                  >
                    //{t("link")}: ={">"}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
        {config?.leftBarContent == "notes" && (
          <div className="overflow-y-auto h-full scrollbar-hidden flex flex-col pt-8 pl-8">
            <h1 className="text-ak-yellow text-2xl p-4 float-end text-shadow">{t("notes")}</h1>
            {notes?.map((element, index) => (
              <div
                className="relative flex flex-col bg-black/50 rounded-lg overflow-clip mb-8 border border-[#3a3a3a] backdrop-blur-sm"
                key={index}
              >
                {editingId === element.id ? (
                  <textarea
                    className="p-4 font-second bg-transparent resize-none outline-none"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    onBlur={() => saveEditing(element.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        saveEditing(element.id);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <div
                    className="p-4 font-second cursor-text"
                    onClick={(e) => {
                        e.stopPropagation();
                        startEditing(element.id, element.data);
                    }}
                    dangerouslySetInnerHTML={{ __html: format(element.data) }}
                  />
                )}
                <div>
                  <IoClose
                    className="float-end w-[24px] h-[24px] m-2 cursor-pointer hover:bg-red-400 rounded-lg transition duration-150"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(element.id);
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              style="bg-ak-yellow text-black w-full mb-4 rounded-lg hover:bg-[#cccc00] transition duration-150 cursor-pointer"
              onClick={() => addNote(t("note example"))}
            >
              {t("add note")}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default LeftBar;